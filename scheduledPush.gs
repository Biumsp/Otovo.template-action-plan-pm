function scheduledPush() {
  if (push() !== "Ok") {
    console.log("failed to push");
  }
}
