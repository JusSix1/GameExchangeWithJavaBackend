package unit_test

import (
	"testing"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
)

func TestOrderValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	order := entity.Order{ // set up data for test
		Slip: "data:image/jpeg;base64,/9j/4AAQ/AndSoOn",
	}

	t.Run("the data is correct", func(t *testing.T) {
		uTest := order

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("Slip picture invalid format", func(t *testing.T) {
		uTest := order
		uTest.Slip = "ascasca"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please change the image")) // check error message
	})
}
