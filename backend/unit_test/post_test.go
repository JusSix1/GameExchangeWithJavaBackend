package unit_test

import (
	"testing"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
)

func TestPostValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	post := entity.Post{ // set up data for test
		Description:       "String",
		Advertising_image: "data:image/jpeg;base64,/9j/4AAQ/AndSoOn",
	}

	t.Run("the data is correct", func(t *testing.T) {
		uTest := post

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("Description can not be blank", func(t *testing.T) {
		uTest := post
		uTest.Description = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Description is blank")) // check error message
	})

	t.Run("Advertising image invalid format", func(t *testing.T) {
		uTest := post
		uTest.Advertising_image = "ascasca"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please change the image")) // check error message
	})
}
