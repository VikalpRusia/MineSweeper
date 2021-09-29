window.addEventListener('unload', function () {
    if (document.visibilityState === 'hidden') {
        const feedback_response = document.querySelector(
            'input[name="feedback"]:checked').value;
        console.log(feedback_response);
        console.log(JSON.stringify({
            feedback: feedback_response
        }));
        navigator.sendBeacon("feedback", JSON.stringify({
                feedback: feedback_response
            })
        );
    }
});
window.addEventListener("load", async function () {
    fetch("feedback")
        .then(response => response.json())
        .then(result => {
            $("input[name=feedback][value=" + result.feedback + "]").prop('checked', true)
        })
        .catch(error => console.error(error));
});
