package user

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/models"
	"github.com/samber/lo"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func TrackItem(c *gin.Context) {
	dbAny, exists := c.Get("db")
	if !exists {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "Could not retrieve database",
		})
		return
	}
	db := dbAny.(*gorm.DB)

	jwtClaimsAny, exists := c.Get("jwt_claims")
	if !exists {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "Could not retrieve JWT claims",
		})
		return
	}
	jwtClaims := jwtClaimsAny.(*models.JWTClaims)

	var reqbody models.AddItemApiRequest
	err := c.ShouldBindJSON(&reqbody)

	if err != nil {
		c.JSON(400, gin.H{
			"message": "Could not read request body",
		})
		return
	}

	itemIds := lo.Uniq(reqbody.Item_IDs)
	err = db.Transaction(func(tx *gorm.DB) error {

		var count int64
		if err := tx.Model(&models.FortniteItem{}).Where("id IN ?", itemIds).Count(&count).Error; err != nil {
			return err
		}
		if count != int64(len(itemIds)) {
			return errors.New("an invalid item id was provided")
		}

		var userItems []models.UserItem
		for _, itemId := range itemIds {
			userItems = append(userItems, models.UserItem{
				UserId: jwtClaims.Id,
				ItemId: itemId,
			})
		}
		if err := tx.Clauses(clause.OnConflict{DoNothing: true}).Create(&userItems).Error; err != nil {
			return err
		}
		return nil

	})
	if err != nil {
		if err.Error() == "an invalid item id was provided" {
			c.AbortWithStatusJSON(400, gin.H{
				"message": "an invalid item id to track was provided",
			})
			return
		}
		c.AbortWithStatusJSON(500, gin.H{
			"message": "internal server error",
		})
	}

	c.JSON(200, gin.H{
		"message": "successfully tracked new items",
	})
}
