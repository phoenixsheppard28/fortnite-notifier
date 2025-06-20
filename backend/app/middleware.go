package main

import (
	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func BotMiddleWare(bot *tgbotapi.BotAPI) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("bot", bot)
		c.Next()
	}
}
