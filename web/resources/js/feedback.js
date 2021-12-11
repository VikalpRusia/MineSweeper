window.addEventListener('unload', function () {
    if (document.visibilityState === 'hidden') {
        const feedback_response = document.querySelector(
            'input[name="feedback"]:checked').value;
        console.log(feedback_response);
        console.log(JSON.stringify({
            feedback: feedback_response
        }));
        navigator.sendBeacon(contextPath + "/feedback", JSON.stringify({
                feedback: feedback_response
            })
        );
    }
});
window.addEventListener("load", async function () {
    fetch(contextPath + "/feedback")
        .then(response => response.json())
        .then(result => {
            $("input[name=feedback][value=" + result.feedback + "]").prop('checked', true)
        })
        .catch(error => console.error(error));
});
const feedback_btn = document.getElementById('feedbackButton');
feedback_btn.classList.add('active', 'disabledbtn');