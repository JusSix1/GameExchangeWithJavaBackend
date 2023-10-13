package unit_test

import (
	"testing"
	"time"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
)

func TestUserValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	user := entity.User{ // set up data for test
		Email:           "123@123.com",
		FirstName:       "สมชาย",
		LastName:        "มาดแมน",
		PersonalID:      "1234567890123",
		Password:        "12345678",
		Profile_Name:    "Udong",
		Profile_Picture: "data:image/jpeg;base64,/9j/4AAQ/AndSoOn",
		Phone_Number:    "0988765432",
		Address:         "หมู่ 1 ต.2 อ.3 จ.4 30000",
		Bank_Account:    "1234567890",
	}

	t.Run("the data is correct", func(t *testing.T) {
		uTest := user

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		println(err)

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("email format invalid", func(t *testing.T) {
		uTest := user
		uTest.Email = "JusSix@123"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Invalid Email format")) // check error message
	})

	t.Run("email can not be blank", func(t *testing.T) {
		uTest := user
		uTest.Email = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Email is blank")) // check error message
	})

	t.Run("First name can not be blank", func(t *testing.T) {
		uTest := user
		uTest.FirstName = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("First name is blank")) // check error message
	})

	t.Run("Last name can not be blank", func(t *testing.T) {
		uTest := user
		uTest.LastName = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Last name is blank")) // check error message
	})

	t.Run("Password is too short", func(t *testing.T) {
		uTest := user
		uTest.Password = "123"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Password must be longer than 8 characters")) // check error message
	})

	t.Run("Password can not be blank", func(t *testing.T) {
		uTest := user
		uTest.Password = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Password is blank")) // check error message
	})

	t.Run("PersonalID is too short or too long", func(t *testing.T) {
		uTest := user
		uTest.PersonalID = "123"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Personal ID must be 13 characters")) // check error message
	})

	t.Run("PersonalID is too short or too long", func(t *testing.T) {
		uTest := user
		uTest.PersonalID = "12345678901234"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Personal ID must be 13 characters")) // check error message
	})

	t.Run("PersonalID invalid format", func(t *testing.T) {
		uTest := user
		uTest.PersonalID = "asdfghjklqwer"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Personal ID invalid format")) // check error message
	})

	t.Run("PersonalID can not be blank", func(t *testing.T) {
		uTest := user
		uTest.PersonalID = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Personal ID is blank")) // check error message
	})

	t.Run("Profile_Name is too long (50)", func(t *testing.T) {
		uTest := user
		uTest.Profile_Name = "1234567890123456788901234567890123456789012345678901234567889012345678901234567890"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Must be no more than 50 characters long")) // check error message
	})

	t.Run("Profile_Name can not be blank", func(t *testing.T) {
		uTest := user
		uTest.Profile_Name = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Profile name is blank")) // check error message
	})

	t.Run("Profile picture invalid format", func(t *testing.T) {
		uTest := user
		uTest.Profile_Picture = "erwbabarb"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please change the picture")) // check error message
	})

	t.Run("Birthday is in future", func(t *testing.T) {
		uTest := user
		uTest.Birthday = time.Now().Add(24 * time.Hour)

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Birthday must not be the future;You must be over 18 years old")) // check error message
	})

	t.Run("Birthday too young", func(t *testing.T) {
		uTest := user
		uTest.Birthday = time.Now()

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("You must be over 18 years old")) // check error message
	})

	t.Run("Phone number can not be blank", func(t *testing.T) {
		uTest := user
		uTest.Phone_Number = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Phone number is blank")) // check error message
	})

	t.Run("Phone number too short)", func(t *testing.T) {
		uTest := user
		uTest.Phone_Number = "1123"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Phone number must be 10 numbers")) // check error message
	})

	t.Run("Phone number too long)", func(t *testing.T) {
		uTest := user
		uTest.Phone_Number = "1233456789054745457457"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Phone number must be 10 numbers")) // check error message
	})

	t.Run("Phone number invalid format (not number)", func(t *testing.T) {
		uTest := user
		uTest.Phone_Number = "sdvwerfwef"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Phone number invalid format")) // check error message
	})

	t.Run("Address can not be blank", func(t *testing.T) {
		uTest := user
		uTest.Address = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Address is blank")) // check error message
	})

	t.Run("Bank account number can not be blank", func(t *testing.T) {
		uTest := user
		uTest.Bank_Account = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Bank account number is blank")) // check error message
	})

	t.Run("Bank account number too short", func(t *testing.T) {
		uTest := user
		uTest.Bank_Account = "1123"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Bank account number must be 10 numbers")) // check error message
	})

	t.Run("Bank account number too long", func(t *testing.T) {
		uTest := user
		uTest.Bank_Account = "12345678900"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Bank account number must be 10 numbers")) // check error message
	})

	t.Run("Bank account number invalid format (not number)", func(t *testing.T) {
		uTest := user
		uTest.Bank_Account = "aaasssdddw"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Bank account number invalid format")) // check error message
	})

}
