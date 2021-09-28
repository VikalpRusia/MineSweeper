window.addEventListener("unload", function (e) {
    const feedback_response = document.querySelector(
        'input[name="feedback"]:checked').value;
    console.log(feedback_response);
    navigator.sendBeacon("feedback", JSON.stringify({
            feedback: feedback_response
        })
    );
});
