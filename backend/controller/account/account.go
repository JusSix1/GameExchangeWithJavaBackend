package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// POST /account/:email
func CreateAccount(c *gin.Context) {
	var user entity.User
	var account entity.Account
	var accountLastID entity.Account
	var game entity.Game
	var reqseller entity.ReqSeller

	email := c.Param("email")

	if err := c.ShouldBindJSON(&account); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("email = ?", email).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", account.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Game not found"})
		return
	}

	if tx := entity.DB().Where("user_id = ? AND is_confirm = true", user.ID).First(&reqseller); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You are not seller"})
		return
	}

	if err := entity.DB().Raw("SELECT * FROM accounts WHERE user_id = ? ORDER BY id DESC LIMIT 1", user.ID).Find(&accountLastID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// create new object for create new record
	newAccount := entity.Account{
		User_ID:        &user.ID,
		ID_Account:     accountLastID.ID_Account + 1,
		Game_Account:   account.Game_Account,
		Game_Password:  account.Game_Password,
		Email:          account.Email,
		Email_Password: account.Email_Password,
		Game_ID:        &game.ID,
		Price:          account.Price,
		Is_Post:        false,
	}

	// validate Account
	if _, err := govalidator.ValidateStruct(newAccount); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&newAccount).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": account})

}

// GET /all-account/:email
func GetAllAccount(c *gin.Context) {
	var user entity.User
	var account []entity.Account

	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := entity.DB().Preload("Game").Raw("SELECT * FROM accounts WHERE user_id = ? ORDER BY id_account DESC", user.ID).Find(&account).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": account})
}

// // GET /account-in-order/:id
// func GetAccountInOrder(c *gin.Context) {
// 	var account []entity.Account

// 	id := c.Param("id")

// 	if err := entity.DB().Raw("SELECT * FROM accounts WHERE order_id = ? ORDER BY id_account DESC", id).Find(&account).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": account})
// }

// PATCH /account
func UpdateAccount(c *gin.Context) {
	var account entity.Account
	var game entity.Game

	if err := c.ShouldBindJSON(&account); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", account.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Game not found"})
		return
	}

	// update user fields that are allowed to be updated
	updateAccount := entity.Account{
		Game_Account:   account.Game_Account,
		Game_Password:  account.Game_Password,
		Email:          account.Email,
		Email_Password: account.Email_Password,
		Game_ID:        &game.ID,
		Price:          account.Price,
	}

	// validate user
	if _, err := govalidator.ValidateStruct(updateAccount); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", account.ID).Updates(&updateAccount).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": account})
}

// DELETE /account
func DeleteAccount(c *gin.Context) {

	type DeleteAccount struct {
		ID uint
	}

	var deleteAccount []DeleteAccount

	if err := c.ShouldBindJSON(&deleteAccount); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i := 0; i < len(deleteAccount); i++ {

		if tx := entity.DB().Exec("DELETE FROM accounts WHERE id = ?", deleteAccount[i].ID); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Account not found"})
			return
		}

	}

	c.JSON(http.StatusOK, gin.H{"data": deleteAccount})
}
