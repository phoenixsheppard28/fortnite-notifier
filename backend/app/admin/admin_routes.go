package admin

import (
	"encoding/json"
	"io"
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/models"
	"gorm.io/gorm"
)

func RebuildItemDatabase(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	cfg := c.MustGet("cfg").(*models.Config)

	req, err := http.NewRequest("GET", cfg.FN_API_ENDPOINT+"v2/items/list", nil)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error creating request",
		})
		return
	}
	req.Header.Add("Authorization", cfg.FN_API_KEY)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error sending request to fortnite API",
		})
		return
	}
	if resp.StatusCode != 200 {
		c.JSON(500, gin.H{
			"message": "Error getting items from fortnite API",
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

	var apiResponse models.FortniteAPIResponse

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

}
