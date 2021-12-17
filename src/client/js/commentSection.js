const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    newComment.appendChild(icon);
    newComment.appendChild(span);
    videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (status === 201) {
    addComment(text);
  }
};

if (form) {
    form.addEventListener("submit", handleSubmit);
} // loggedIn이 아니라면 form이 없기 때문에 오류가 난다

// 삭제 기능 만들어주기 

/*(BIG 중요 포인트) 요약:
1. fetch로 백엔드에 요청을 보낼 때에
method: "POST",
headers: {},
body: {},

URL과 더불어 이 세 가지를 덧붙여야 한다.

2. headers에는 이 요청의 세부 사항을 명시하며, body에는 실질적인 컨텐츠가 포함된다.

3. 따로 명시하지 않을 시에 모든 body의 컨텐츠는 Text File로서 전송되고 받아 인식된다.

4. 특히 body: { ... }, 이런 식으로 자바스크립트 오브젝트를 넘겨줄 시 외부에서 이 오브젝트는 [object Object]라는 의미 없는 문자열로 변환된다.

5. 오브젝트와 그 안의 세부 변수 목록들을 넘겨주고 싶을 시, JSON이라는 규약에 의거한 오브젝트 내의 모든 기록을 텍스트화하여 넘겨주어야 하는데, 이때 JSON.stringify({ ... }) 라는 편리한 자체 표준 함수를 사용하면 된다.

6. 덧붙여 headers 안에 "Content-Type": "application/json"이라는 명시를 해 주어 전송된 텍스트가 JSON파일임을 백엔드에 인식시켜 준다.

7. 백엔드에 (이를테면 express를 사용 중이라면) app.use(express.json()); 미들웨어를 추가해주어 자체 내에서 JSON.parse("..."); JSON파일을 다시 자바스크립트 오브젝트로 변환해주는 표준 함수로 요청 body 내의 컨텐츠를 디코딩하는 작업을 한다.*/