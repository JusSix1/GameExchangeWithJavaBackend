package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

// ----------User----------
type Gender struct {
	gorm.Model
	Gender string
	User   []User `gorm:"foreignKey:Gender_ID"`
}

type User struct {
	gorm.Model
	Email           string      `gorm:"uniqueIndex" valid:"email~Invalid Email format,required~Email is blank"`
	FirstName       string      `valid:"required~First name is blank"`
	LastName        string      `valid:"required~Last name is blank"`
	Password        string      `valid:"minstringlength(8)~Password must be longer than 8 characters,required~Password is blank"`
	PersonalID      string      `valid:"minstringlength(13)~Personal ID must be 13 characters,maxstringlength(13)~Personal ID must be 13 characters,matches([0-9]{10})~Personal ID invalid format,required~Personal ID is blank"`
	Profile_Name    string      `valid:"maxstringlength(50)~Must be no more than 50 characters long,required~Profile name is blank"`
	Profile_Picture string      `valid:"image_valid~Please change the picture"`
	Birthday        time.Time   `valid:"NotFutureTime~The day must not be the future,MoreThan18YearsAgo~You must be over 18 years old"`
	Phone_Number    string      `valid:"required~Phone number is blank,matches([0-9]{10})~Phone number invalid format"`
	Address         string      `valid:"required~Address is blank"`
	Bank_Account    string      `valid:"required~Bank account number is blank,matches([0-9]{10})~Bank account number invalid format"`
	Gender_ID       *uint       `valid:"-"`
	Facebook        string      `valid:"-"`
	Instagram       string      `valid:"-"`
	Line            string      `valid:"-"`
	Gender          Gender      `gorm:"references:id" valid:"-"`
	Account         []Account   `gorm:"foreignKey:User_ID"`
	Order           []Order     `gorm:"foreignKey:User_ID"`
	Revenue         []Revenue   `gorm:"foreignKey:User_ID"`
	Post            []Post      `gorm:"foreignKey:User_ID"`
	Commenter       []Comment   `gorm:"foreignKey:Commenter_ID"`
	Victim          []Comment   `gorm:"foreignKey:Victim_ID"`
	ReqSeller       []ReqSeller `gorm:"foreignKey:User_ID"`
	ReqGame         []ReqGame   `gorm:"foreignKey:User_ID"`
}

type Game struct {
	gorm.Model
	Name    string    `gorm:"uniqueIndex" valid:"required~game name is blank"`
	Account []Account `gorm:"foreignKey:Game_ID"`
}

type ReqGame struct {
	gorm.Model
	User_ID  *uint  `valid:"-"`
	User     User   `gorm:"references:id" valid:"-"`
	Name     string `valid:"required~game name is blank"`
	Is_Check bool   `valid:"-"`
}

type Account struct {
	gorm.Model
	ID_Account     uint    `valid:"-"`
	User_ID        *uint   `valid:"-"`
	User           User    `gorm:"references:id" valid:"-"`
	Game_Account   string  `valid:"required~Game account is blank"`
	Game_Password  string  `valid:"required~Game password is blank"`
	Email          string  `valid:"-"`
	Email_Password string  `valid:"-"`
	Price          uint    `valid:"required~Price is blank"`
	Game_ID        *uint   `valid:"-"`
	Game           Game    `gorm:"references:id" valid:"-"`
	Is_Post        bool    `valid:"-"`
	Is_Sell        bool    `valid:"-"`
	Order          []Order `gorm:"foreignKey:Account_ID"`
	Post           []Post  `gorm:"foreignKey:Account_ID"`
}

type Order struct {
	gorm.Model
	User_ID         *uint     `valid:"-"`
	User            User      `gorm:"references:id" valid:"-"`
	Account_ID      *uint     `valid:"-"`
	Account         Account   `gorm:"references:id" valid:"-"`
	Slip            string    `valid:"image_valid~Please change the picture"`
	Slip_Create_At  time.Time `valid:"-"`
	Is_Slip_Confirm bool      `valid:"-"`
	Is_Receive      bool      `valid:"-"`
}

type Revenue struct {
	gorm.Model
	User_ID *uint   `valid:"-"`
	User    User    `gorm:"references:id" valid:"-"`
	Income  float64 `valid:"required~Income is blank"`
}

type Post struct {
	gorm.Model
	User_ID           *uint   `valid:"-"`
	User              User    `gorm:"references:id" valid:"-"`
	Account_ID        *uint   `valid:"-"`
	Account           Account `gorm:"references:id" valid:"-"`
	Description       string  `valid:"required~Description is blank"`
	Advertising_image string  `valid:"image_valid~Please change the image"`
	Is_Reserve        bool    `valid:"-"`
}

type Comment struct {
	gorm.Model
	Commenter_ID *uint  `valid:"-"`
	Commenter    User   `gorm:"references:id" valid:"-"`
	Victim_ID    *uint  `valid:"-"`
	Victim       User   `gorm:"references:id" valid:"-"`
	Comment_Text string `valid:"-"`
	Rating       uint   `valid:"range(1|5)~Invalid rating format"`
	Review_image string `valid:"image_valid~Please change the image"`
}

type Admin struct {
	gorm.Model
	Account_Name string      `gorm:"uniqueIndex" valid:"required~Name is blank"`
	Password     string      `valid:"minstringlength(8)~Password must be longer than 8 characters,required~Password is blank"`
	Admin_Name   string      `valid:"required~Name is blank"`
	ReqSeller    []ReqSeller `gorm:"foreignKey:Admin_ID"`
}

type ReqSeller struct {
	gorm.Model
	User_ID             *uint  `valid:"-"`
	User                User   `gorm:"references:id" valid:"-"`
	Admin_ID            *uint  `valid:"-"`
	Admin               Admin  `gorm:"references:id" valid:"-"`
	Personal_Card_Front string `valid:"required~Front image is blank, image_valid~Please change the image"`
	Personal_Card_Back  string `valid:"required~Back image is blank,image_valid~Please change the image"`
	Is_Confirm          bool   `valid:"-"`
	Note                string `valid:"-"`
	Is_Reject           bool   `valid:"-"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("DelayNow10Min", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -10))
	})

	govalidator.CustomTypeTagMap.Set("NotFutureTime", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return !t.After(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("MoreThan18YearsAgo", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		ageLimit := time.Now().AddDate(-18, 0, 0)
		return t.Before(ageLimit)
	})

	govalidator.TagMap["image_valid"] = govalidator.Validator(func(str string) bool {
		return govalidator.Matches(str, "^(data:image(.+);base64,.+)$")
	})
}
