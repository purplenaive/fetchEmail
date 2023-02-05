import React, { useCallback } from "react";

// type
type CommonObject = {
  [key: string]: any
};
type FormArray = [ string, string | FormDataEntryValue];
interface EmailData extends CommonObject {
  fullName: string,
  emailAddress: string,
  websites?: string,
  telegram?: string,
  skype?: string,
  msn?: string,
  message: string,
};

/**
 * (calculate) FormData를 [key, value] 구성의 배열로 반환합니다.
 * @param data new FormData의 데이터
 * @returns 
 */
function formDataToArray (formElement: HTMLFormElement): FormArray[] {
  return [...new FormData(formElement).entries()];
}

/**
 * (calculate) host에 따라 url 리턴
 * @param host 
 * @returns 
 */
function getEmailRequestUrl (host: string) {
  return host.startsWith("localhost") ? "http://localhost:8080" : "//";
}
/**
 * (calculate) 배열을 객체로 변환하여 반환한다
 * @param data 객체로 변환할 배열
 * @returns 
 */
function changeArrayToObject(data: Array<FormArray>): CommonObject {
  const result: CommonObject = {};

  for(let item of data) {
    result[item[0]] = item[1];
  }

  return result;
}
/**
 * (action) email data를 fetch로 전송합니다.
 * @param url 요청하는 url
 * @param data email data
 * @returns 
 */
async function fetchEmailForm(url: string, data: CommonObject) {
  // 원래 async 안 썼음

  // ============ 내가 쓴 거 (1) ============ //
  // return new Promise((resolve, reject) => {

  //   fetch(`${url}/api/email`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json", // 이 형식에 따라서 body에 data의 형식이 달라져도 될 거 같은데..
  //     },
  //     body: JSON.stringify(data)
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       if (data.code >= 400) {
  //         reject("fail to send email data");
  //       } else {
  //         resolve(data);
  //       }
  //     })
  // });

  // ============ 내가 쓴 거 (2) ============ //
  return await fetch(url, { // 아니 fetch가 promise를 반환한다는데 그러면 ... promise로 안 감싸도 되잖아
    method: "POST",
    headers: {
      "Content-Type": "application/json", // 이 형식에 따라서 body에 data의 형식이 달라져도 될 거 같은데..
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      
      if (response.ok) {
        return response.json();
      } else {
        throw Error("이메일 전송 요청에 실패했습니다.");
      }
    })
    // .then((data) => data);

    // ============ 자동으로 고쳐준 거 ============ //
    // const response = await fetch(`${url}/api/email`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data)
    // });
    // const result = await response.json();
    // return result;

}

function Email (): React.ReactElement {
  // submit 누를 경우 함수
  const submitEmail = useCallback(function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { currentTarget } = event;
    const url = getEmailRequestUrl(window.location.host) + "/api/email";
    const formData = formDataToArray(currentTarget);
    const trimedFormData = changeArrayToObject(formData);
    const response = fetchEmailForm(url, trimedFormData); // promise를 반환함(X) => await이라 결과값을 반환함

    response
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      })

  }, []);

  return (
    <section className="page email-page">
      {/* form */}
      <form 
        id="email-form"
        action="post"
        className="email-form" 
        onSubmit={submitEmail}
      >
        {/* 이 form들 반복문으로 처리해도 될 거 같은데, useState를 쓸 것 아니라면 반복문 해도 되지 않을까 */}
        {/* full name */}
        <label className="common-label">
          <span className="label__text">Full Name</span>
          <input type="text" className="common-input label__input" name="fullName" required/>
        </label>
        {/* email address */}
        <label className="common-label">
          <span className="label__text">Email Address</span>
          <input type="email" className="common-input label__input" name="EmailAddress" required/>
        </label>
        {/* website */}
        <label className="common-label">
          <span className="label__text">website</span>
          <input type="text" className="common-input label__input" name="website"/>
        </label>
        {/* telegram */}
        <label className="common-label">
          <span className="label__text">telegram</span>
          <input type="text" className="common-input label__input" name="telegram"/>
        </label>
        {/* skype */}
        <label className="common-label">
          <span className="label__text">skype</span>
          <input type="text" className="common-input label__input" name="skype"/>
        </label>
        {/* msn */}
        <label className="common-label">
          <span className="label__text">msn</span>
          <input type="text" className="common-input label__input" name="msn"/>
        </label>
        {/* message */}
        <label className="common-label">
          <span className="label__text">message</span>
          <input type="text" className="common-input label__input" name="message" required/>
        </label>

        <div className="form__actions">
          <button 
            className="common-button submit-email-form-button"
          >제출</button>
        </div>
      </form>

    </section>
  )
}

export { Email };