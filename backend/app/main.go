package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/admin"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/models"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/static"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/user"
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
	db.AutoMigrate(&models.User{}, &models.FortniteItem{}, &models.UserItem{}) // auto create tables if they dont exist

	cors_cfg := cors.DefaultConfig()
	cors_cfg.AllowOrigins = []string{cfg.FRONTEND_URL}
	cors_cfg.AllowHeaders = append(cors_cfg.AllowHeaders, "Authorization")

	router := gin.Default()
	router.Use(BotMiddleWare(bot), DBMiddleWare(db), CfgMiddleWare(cfg), cors.New(cors_cfg))

	router.POST("/webhook", Webhook)
	router.GET("/", SayHello)

	adminGroup := router.Group("/admin", AdminAuthMiddleWare(cfg))
	adminGroup.POST("/item/rebuild", admin.RebuildItemDatabase)

	authGroup := router.Group("/auth")
	authGroup.GET("/telegram", TelegramAuthHandler)
	authGroup.POST("/verify-jwt", JWTAuthMiddleWare(cfg), VerifyJWT)

	UserGroup := router.Group("/user")
	UserGroup.Use(JWTAuthMiddleWare(cfg))
	UserGroup.POST("/item", user.TrackItem)
	// corresponding get method

	SetupWebhook(bot, cfg)
	router.Run(cfg.PORT) // blocks any further code, nothing can run under this
}
