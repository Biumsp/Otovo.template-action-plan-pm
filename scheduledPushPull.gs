function scheduledPushPull() {
  let resultOfPush = push();
  if (resultOfPush !== "Ok") return;
  pull();
}
