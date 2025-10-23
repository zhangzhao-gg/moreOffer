package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// OfferData 定义offer数据结构
type OfferData struct {
	OfferCount  int    `json:"offerCount" binding:"min=0"`
	SalaryRange string `json:"salaryRange" binding:"required"`
	Industry    string `json:"industry" binding:"required"`
}

// OfferSubmission 数据库模型
type OfferSubmission struct {
	ID              int       `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
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

	// 获取统计数据
	r.GET("/api/stats", func(c *gin.Context) {
		// 获取查询参数：当前用户的行业和薪资区间
		userIndustry := c.Query("industry")
		userSalaryRange := c.Query("salaryRange")
		var totalCount int64
		var offerCount int64
		var avgOffers float64
		var todayCount int64

		// 获取总数据量
		db.Model(&OfferSubmission{}).Count(&totalCount)

		// 获取有offer的数据量
		db.Model(&OfferSubmission{}).Where("offer_count > 0").Count(&offerCount)

		// 计算平均offer数量
		var result struct {
			AvgOffers float64 `gorm:"column:avg_offers"`
		}
		db.Model(&OfferSubmission{}).Select("AVG(offer_count) as avg_offers").Scan(&result)
		avgOffers = result.AvgOffers

		// 获取今日新增数据量
		today := time.Now().Format("2006-01-02")
		db.Model(&OfferSubmission{}).Where("DATE(created_at) = ?", today).Count(&todayCount)

		// 计算有offer率
		var offerRate float64
		if totalCount > 0 {
			offerRate = float64(offerCount) / float64(totalCount) * 100
		}

		// 获取薪资分布数据
		var salaryDistribution []struct {
			SalaryRange string `json:"salary_range"`
			Count       int64  `json:"count"`
		}
		err := db.Raw(`
			SELECT salary_range, COUNT(*) as count 
			FROM offer_submissions 
			GROUP BY salary_range 
			ORDER BY count DESC
		`).Scan(&salaryDistribution).Error

		if err != nil {
			logrus.WithError(err).Error("查询薪资分布数据失败")
		}

		// 获取个人定位数据（基于用户数据计算）
		var personalStats struct {
			AboveAveragePercent float64 `json:"above_average_percent"`
			IndustryPercentile  float64 `json:"industry_percentile"`
		}

		// 计算个人定位数据
		if totalCount > 0 {
			// 超越同专业同学 - 暂时设为默认值0
			personalStats.AboveAveragePercent = 0.0

			// 薪资处于行业前 - 根据当前用户的行业和薪资计算
			if userIndustry != "" && userSalaryRange != "" {
				// 获取该行业的所有薪资分布
				var industrySalaryStats []struct {
					SalaryRange string `json:"salary_range"`
					Count       int64  `json:"count"`
				}
				db.Raw(`
					SELECT salary_range, COUNT(*) as count 
					FROM offer_submissions 
					WHERE industry = ?
					GROUP BY salary_range
				`, userIndustry).Scan(&industrySalaryStats)

				// 计算该行业总人数
				var industryTotal int64
				for _, stat := range industrySalaryStats {
					industryTotal += stat.Count
				}

				if industryTotal > 0 {
					// 计算薪资大于等于当前薪资的人数
					var higherOrEqualCount int64

					// 薪资区间排序（从低到高）
					salaryRanges := []string{"5-10K", "10-15K", "15-20K", "20-25K", "25-30K", "30-40K", "40-50K", "50K以上"}

					// 找到当前薪资区间的位置
					currentIndex := -1
					for i, range_ := range salaryRanges {
						if range_ == userSalaryRange {
							currentIndex = i
							break
						}
					}

					if currentIndex >= 0 {
						// 计算当前薪资区间及以上的总人数
						for i := currentIndex; i < len(salaryRanges); i++ {
							for _, stat := range industrySalaryStats {
								if stat.SalaryRange == salaryRanges[i] {
									higherOrEqualCount += stat.Count
								}
							}
						}

						// 计算百分位：薪资大于等于当前薪资的人数 / 该行业总人数 * 100
						personalStats.IndustryPercentile = float64(higherOrEqualCount) / float64(industryTotal) * 100

						// 添加调试日志
						logrus.WithFields(logrus.Fields{
							"userIndustry":       userIndustry,
							"userSalaryRange":    userSalaryRange,
							"industryTotal":      industryTotal,
							"higherOrEqualCount": higherOrEqualCount,
							"industryPercentile": personalStats.IndustryPercentile,
						}).Info("薪资处于行业前计算详情")
					} else {
						personalStats.IndustryPercentile = 0.0
					}
				} else {
					personalStats.IndustryPercentile = 0.0
				}
			} else {
				// 如果没有提供用户信息，设为默认值
				personalStats.IndustryPercentile = 0.0
			}
		} else {
			// 如果没有数据，设为默认值
			personalStats.AboveAveragePercent = 0.0
			personalStats.IndustryPercentile = 0.0
		}

		// 添加调试日志
		logrus.WithFields(logrus.Fields{
			"salaryDistribution": salaryDistribution,
			"personalStats":      personalStats,
			"totalCount":         totalCount,
		}).Info("统计数据详情")

		// 构建响应数据
		responseData := gin.H{
			"totalSubmissions": totalCount,
			"offerRate":        offerRate,
			"avgOffers":        avgOffers,
			"todayNew":         todayCount,
		}

		// 添加薪资分布数据
		if len(salaryDistribution) > 0 {
			responseData["salaryDistribution"] = salaryDistribution
		} else {
			responseData["salaryDistribution"] = []gin.H{}
		}

		// 添加个人统计数据
		responseData["personalStats"] = personalStats

		c.JSON(http.StatusOK, gin.H{
			"message": "统计数据获取成功",
			"data":    responseData,
		})
	})

	// 提交offer数据的接口
	r.POST("/api/offer", func(c *gin.Context) {
		// 先打印原始请求体
		body, _ := c.GetRawData()
		logrus.WithField("rawBody", string(body)).Info("收到原始请求体")

		// 重新设置请求体
		c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(body))

		var offerData OfferData

		if err := c.ShouldBindJSON(&offerData); err != nil {
			logrus.WithError(err).Error("解析offer数据失败")
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "数据格式错误",
				"details": err.Error(),
			})
			return
		}

		// 手动验证 offerCount
		if offerData.OfferCount < 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Offer数量不能为负数",
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
