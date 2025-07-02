package main

import (
	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"gorm.io/gorm"
)

func BotMiddleWare(bot *tgbotapi.BotAPI) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("bot", bot)
		c.Next()
	}
}

func DBMiddleWare(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func CfgMiddleWare(cfg *Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("cfg", cfg)
		c.Next()
	}
}

func AdminAuthMiddleWare(cfg *Config) gin.HandlerFunc {
	return func(c *gin.Context) {

		api_key := c.GetHeader("x-api-key")
		if api_key != cfg.ADMIN_API_KEY {
			c.AbortWithStatusJSON(401, gin.H{
				"message": "unauthorized",
			})
			return
		}
		c.Next()
	}
}
