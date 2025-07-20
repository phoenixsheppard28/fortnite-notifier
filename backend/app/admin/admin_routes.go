package admin

import (
	"encoding/json"
	"io"
	"slices"

	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/models"
	"gorm.io/gorm"
)

func RebuildItemDatabase(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	cfg := c.MustGet("cfg").(*models.Config)

	resp, err := sendFortniteApiRequest("v2/items/list", cfg)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "error sending the api request",
			"error":   err.Error(),
		})
		return
	}
	if resp.StatusCode != 200 {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "External API returned a status code not 200",
		})
		return
	}

	defer resp.Body.Close() // runs at the end of this function
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error: Could not read body of api response",
		})
		return
	}

	var apiResponse models.FortniteAllAPIResponse

	err = json.Unmarshal(body, &apiResponse)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Incoming fortnite API response could not bind to set struct",
			"error":   err.Error(),
		})
		return
	}

	db.Transaction(func(tx *gorm.DB) error {
		tx.Where("1=1").Delete(&models.FortniteItem{}) // clear table

		var itemsToInsert []models.FortniteItem
		for _, item := range apiResponse.Items {
			if slices.Contains(item.GameplayTags, "Cosmetics.Source.ItemShop") && item.ReleaseDate != nil {
				var dbItem = models.FortniteItem{
					ID:     item.ID,
					Name:   item.Name,
					Type:   item.Type.Name,
					Price:  item.Price,
					Rarity: item.Rarity.ID,
					Image:  item.Images.Icon,
				}
				if item.Set != nil {
					dbItem.SetName = item.Set.Name
				}
				if item.LastAppearance != nil {
					dbItem.LastAppearance = *item.LastAppearance
				}

				itemsToInsert = append(itemsToInsert, dbItem)

			}
		}
		if err := tx.CreateInBatches(&itemsToInsert, 100).Error; err != nil {
			c.JSON(500, gin.H{
				"message": "Could not rebuild item database",
				"error":   err.Error(),
			})
			return err
		}

		return nil
	})
}

func DailyShopCheck(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	cfg := c.MustGet("cfg").(*models.Config)
	bot := c.MustGet("bot").(*tgbotapi.BotAPI)

	resp, err := sendFortniteApiRequest("v2/shop", cfg)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "error sending the api request",
			"error":   err.Error(),
		})
		return
	}
	if resp.StatusCode != 200 {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "External API returned a status code not 200",
		})
		return
	}
	defer resp.Body.Close() // runs at the end of this function
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error: Could not read body of api response",
		})
		return
	}

	var apiResponse models.FortniteShopAPIResponse
	err = json.Unmarshal(body, &apiResponse)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "Could not bind forntite api shop response to set struct",
			"error":   err.Error(),
		})
		return
	}
	var item_ids []string

	for _, items := range apiResponse.Shop {
		item_ids = append(item_ids, items.MainID)
	}

	var user_items []models.UserItem
	var items []models.FortniteItem

	db.Transaction(func(tx *gorm.DB) error {
		tx.Where("item_id IN ?", item_ids).Find(&user_items)
		tx.Where("id IN ?", item_ids).Find(&items)
		return nil
	})

	itemMap := make(map[string]*models.FortniteItem)
	for _, item := range items {
		itemMap[item.ID] = &item
	}

	user_item_name_map := make(map[int64][]string)
	for _, row := range user_items {
		user_item_name_map[row.UserId] = append(user_item_name_map[row.UserId], itemMap[row.ItemId].Name)
	}

	err = alertUsers(&user_item_name_map, bot)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "error sending alert",
			"err":     err.Error(),
		})
		return
	}

}
