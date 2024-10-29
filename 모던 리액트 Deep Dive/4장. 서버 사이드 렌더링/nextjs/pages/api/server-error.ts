export default function handler(req, res) {
  res.status(500).json({
    error: "Internal Server Error",
    message: "서버에서 처리 중 문제가 발생했습니다. 나중에 다시 시도해 주세요.",
  });
}
