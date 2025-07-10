package main

import (
	"errors"

	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/golang-jwt/jwt/v5"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/models"
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

func CfgMiddleWare(cfg *models.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("cfg", cfg)
		c.Next()
	}
}

func AdminAuthMiddleWare(cfg *models.Config) gin.HandlerFunc {
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

func JWTAuthMiddleWare(cfg *models.Config) gin.HandlerFunc {
	// if it passes this, user is GUARENTEED to exist, becase its confirmed in telegramauth with Userexits
	return func(c *gin.Context) {

		jwt_secret := []byte(cfg.JWT_SECRET)

		authToken := c.GetHeader("Authorization")

		if authToken == "" {
			c.AbortWithStatusJSON(401, gin.H{
				"valid":   false,
				"message": "Authorization token not provided",
			})
			return
		}

		token, err := jwt.ParseWithClaims(authToken, &models.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			if method, ok := token.Method.(*jwt.SigningMethodHMAC); !ok || method.Alg() != jwt.SigningMethodHS256.Alg() {
				return nil, errors.New("invalid algorithm or signing method")
			}
			return jwt_secret, nil
		})

		if err != nil {
			if errors.Is(err, jwt.ErrTokenExpired) {
				c.AbortWithStatusJSON(401, gin.H{
					"valid":   false,
					"message": "Token expired",
				})
				return
			}
			c.AbortWithStatusJSON(401, gin.H{
				"valid":   false,
				"message": "other error in validating claims",
			})
			return
		}
		_, ok := token.Claims.(*models.JWTClaims)
		if !ok {
			c.AbortWithStatusJSON(401, gin.H{
				"valid":   false,
				"message": "invalid claims format",
			})
			return
		}
		c.Set("jwt_claims", token.Claims.(*models.JWTClaims))
		c.Next()
	}
}
