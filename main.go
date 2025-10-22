package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// OfferData 定义offer数据结构
type OfferData struct {
	OfferCount  int    `json:"offerCount" binding:"required,min=0"`
	SalaryRange string `json:"salaryRange" binding:"required"`
	Industry    string `json:"industry" binding:"required"`
}

// OfferSubmission 数据库模型
type OfferSubmission struct {
	ID              int       `gorm:"primaryKey;autoIncrement" json:"id"`
	EducationLevel  *string   `gorm:"column:education_level" json:"education_level"`
	SchoolTier      *string   `gorm:"column:school_tier" json:"school_tier"`
	MajorCategory   *string   `gorm:"column:major_category" json:"major_category"`
	OfferCount      int       `gorm:"column:offer_count" json:"offer_count"`
	SalaryRange     string    `gorm:"column:salary_range" json:"salary_range"`
	Industry        string    `gorm:"column:industry" json:"industry"`
	CityTier        *string   `gorm:"column:city_tier" json:"city_tier"`
	CreatedAt       time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt       time.Time `gorm:"column:updated_at" json:"updated_at"`
	UserFingerprint *string   `gorm:"column:user_fingerprint" json:"user_fingerprint"`
}

// TableName 指定表名
func (OfferSubmission) TableName() string {
	return "offer_submissions"
}

var db *gorm.DB

// initDB 初始化数据库连接
func initDB() {
	// 获取数据库配置
	config := getDatabaseConfig()
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.Username, config.Password, config.Host, config.Port, config.Database)

	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		logrus.WithError(err).Fatal("数据库连接失败")
	}

	// 自动迁移数据库表结构
	err = db.AutoMigrate(&OfferSubmission{})
	if err != nil {
		logrus.WithError(err).Fatal("数据库迁移失败")
	}

	logrus.Info("数据库连接成功")
}

func main() {
	// 配置logrus
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.SetLevel(logrus.InfoLevel)

	// 初始化数据库
	initDB()

	r := gin.Default()

	// 添加CORS中间件
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// 健康检查接口
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Offer透透服务运行正常",
		})
	})

	// 获取所有offer提交记录
	r.GET("/api/offers", func(c *gin.Context) {
		var submissions []OfferSubmission
		result := db.Order("created_at DESC").Find(&submissions)
		if result.Error != nil {
			logrus.WithError(result.Error).Error("查询offer数据失败")
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "查询数据失败",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "查询成功",
			"data":    submissions,
			"count":   len(submissions),
		})
	})

	// 提交offer数据的接口
	r.POST("/api/offer", func(c *gin.Context) {
		var offerData OfferData

		if err := c.ShouldBindJSON(&offerData); err != nil {
			logrus.WithError(err).Error("解析offer数据失败")
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "数据格式错误",
				"details": err.Error(),
			})
			return
		}

		// 使用logrus打印数据
		logrus.WithFields(logrus.Fields{
			"offerCount":  offerData.OfferCount,
			"salaryRange": offerData.SalaryRange,
			"industry":    offerData.Industry,
		}).Info("收到新的offer数据")

		// 保存到数据库
		submission := OfferSubmission{
			OfferCount:  offerData.OfferCount,
			SalaryRange: offerData.SalaryRange,
			Industry:    offerData.Industry,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}

		// 生成简单的用户指纹（基于IP和时间戳）
		userFingerprint := fmt.Sprintf("%s_%d", c.ClientIP(), time.Now().Unix())
		submission.UserFingerprint = &userFingerprint

		result := db.Create(&submission)
		if result.Error != nil {
			logrus.WithError(result.Error).Error("保存数据到数据库失败")
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "数据保存失败",
			})
			return
		}

		logrus.WithField("submissionId", submission.ID).Info("数据已保存到数据库")

		c.JSON(http.StatusOK, gin.H{
			"message": "数据提交成功",
			"data":    offerData,
			"id":      submission.ID,
		})
	})

	logrus.Info("服务器启动在端口 :8080")
	r.Run(":8080")
}
