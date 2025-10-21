package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// OfferData 定义offer数据结构
type OfferData struct {
	OfferCount  int    `json:"offerCount" binding:"required,min=0"`
	SalaryRange string `json:"salaryRange" binding:"required"`
	Industry    string `json:"industry" binding:"required"`
}

func main() {
	// 配置logrus
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.SetLevel(logrus.InfoLevel)

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

		c.JSON(http.StatusOK, gin.H{
			"message": "数据提交成功",
			"data":    offerData,
		})
	})

	logrus.Info("服务器启动在端口 :8080")
	r.Run(":8080")
}
