package main

import (
	"log"

	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/static"
)

func main() {
	cfg := GetConfig()
	bot, err := tgbotapi.NewBotAPI(cfg.TELEGRAM_TOKEN)
	if err != nil {
		log.Fatalf("Could not initlaize telgram bot %v", err)
	}
	bot.Debug = true //  logs all interactions w telegram servers
	log.Printf("Authorized on account %s", bot.Self.UserName)

	static.LoadStaticResponses()

	router := gin.Default()
	router.Use(BotMiddleWare(bot))

	router.POST("/webhook", Webhook)
	router.GET("/", SayHello)
	router.Run(cfg.PORT)

	SetupWebhook(bot, cfg)

}
