import express, { json } from "express";
import path, { join } from "path";
import cors from "cors";

const app = express();
const __dirname = path.resolve();

// cors 회피
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

// 기본 서버 설정
app.listen(8080, function () {
  console.log("listening on 8080");
});

app.use(express.static(path.join(__dirname, "build")));
app.post("/", function (request, response) {
  response.sendFile(join(__dirname, "build", "index.html"));
});

// data 요청 처리
app.post("/api/email", (request, response) => {
  const data = request.body;

  console.log(data);
  response.json({ code: 200, message: "success" });
});

// router 설정은 react가 하도록
// 주소창에서 바로 이동 요청 => 하지만 서버에서는 라우트 설정을 안하기 때문에
// 위에 모든 설정들을 거치고도 해당 요청을 알 수 없다면 react에게 다시 넘기는 설정임
app.get("*", function (request, response) {
  response.sendFile(join(__dirname, "build", "index.html"));
});
