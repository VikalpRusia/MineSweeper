window.addEventListener("unload", function () {
    const feedback_response = document.querySelector(
        'input[name="feedback"]:checked').value;
    console.log(feedback_response);
    navigator.sendBeacon("set-feedback", JSON.stringify({
            feedback: feedback_response
        })
    );
});
window.addEventListener("load", async function () {
    fetch("get-feedback")
        .then(response => response.json())
        .then(result => {
            $("input[name=feedback][value=" + result.feedback + "]").prop('checked', true)
        })
        .catch(error => console.error(error));
});
