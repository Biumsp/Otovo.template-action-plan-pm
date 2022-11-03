function scheduledPush() {
  if (push() !== "Ok") {
    record("last_push");
    return;
  } else {
    console.log("failed to push");
  }
}
