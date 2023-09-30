package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// POST /users
func CreateAdmin(c *gin.Context) {
	var admin entity.Admin
	var account_nameCheck entity.Admin

	if err := c.ShouldBindJSON(&admin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("account_name = ?", admin.Account_Name).First(&account_nameCheck); !(tx.RowsAffected == 0) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This account name has already been taken."})
		return
	}

	// create new object for create new record
	newAdmin := entity.Admin{
		Account_Name: admin.Account_Name,
		Admin_Name:   admin.Admin_Name,
		Password:     admin.Password,
	}

	// validate user
	if _, err := govalidator.ValidateStruct(newAdmin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// hashing after validate
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(newAdmin.Password), 12)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error hashing password"})
		return
	}

	newAdmin.Password = string(hashPassword)

	if err := entity.DB().Create(&newAdmin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": newAdmin})

}

// GET /listadmin
func GetListAdmin(c *gin.Context) {
	var admin []entity.Admin

	if err := entity.DB().Raw("SELECT id,created_at,account_name,admin_name FROM admins WHERE  deleted_at IS NULL").Find(&admin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": admin})
}

// DELETE /admin/:account_name
func DeleteAdmin(c *gin.Context) {
	account_name := c.Param("account_name")

	type DataIn struct {
		ID       uint   `valid:"-"`
		Password string `valid:"minstringlength(8)~Password must be longer than 8 characters,required~Password is blank"`
	}

	var dataIn DataIn
	var admin entity.Admin
	var deleteAdmin entity.Admin

	if err := c.ShouldBindJSON(&dataIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// validate PasswordUser
	if _, err := govalidator.ValidateStruct(dataIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("account_name = ?", account_name).Last(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Admin not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", dataIn.ID).Last(&deleteAdmin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't find the admin to delete"})
		return
	}

	if admin.Account_Name == deleteAdmin.Account_Name {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to erase yourself"})
		return
	}

	// ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(dataIn.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is incorrect"})
		return
	}

	if tx := entity.DB().Where("id = ?", deleteAdmin.ID).Delete(&entity.Admin{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Admin not found"})
		return
	}

	// updateAdmin := entity.Admin{
	// 	Account_Name: "-",
	// }

	// if err := entity.DB().Where("email = ?", Password.Email).Updates(&deleteUser).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{"data": deleteAdmin})
}
