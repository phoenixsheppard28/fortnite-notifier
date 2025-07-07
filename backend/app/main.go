package main

import (
	"log"

	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/static"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
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
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  cfg.DB_STRING,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})

	if err != nil {
		log.Fatalf("Couod not intiialize database connection")
	}
	db.AutoMigrate(&User{}, &FortniteItem{}) // auto create tables if they dont exist

	router := gin.Default()
	router.Use(BotMiddleWare(bot), DBMiddleWare(db), CfgMiddleWare(cfg))

	router.POST("/webhook", Webhook)
	router.GET("/", SayHello)

	adminGroup := router.Group("/admin", AdminAuthMiddleWare(cfg))
	adminGroup.POST("/item/rebuild", RebuildItemDatabase)

	authGroup := router.Group("/auth")
	authGroup.GET("/telegram", TelegramAuthHandler)

	router.Run(cfg.PORT)
	SetupWebhook(bot, cfg)

}
