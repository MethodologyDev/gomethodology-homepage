document.addEventListener('DOMContentLoaded', function() {
  const zipInput = document.querySelector('.zip-code-input');
  const checkButton = document.querySelector('.check-avail-btn');
  const resultDiv = document.createElement('div');
  resultDiv.className = 'availability-result';
  document.querySelector('.btn-wrapper').appendChild(resultDiv);

  checkButton.addEventListener('click', function(e) {
    e.preventDefault();
    const zipCode = zipInput.value.trim();
    if (zipCode) {
      checkAvailability(zipCode);
    } else {
      resultDiv.textContent = 'Please enter a valid ZIP code.';
    }
  });

  function checkAvailability(zipCode) {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.9");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Origin", "https://www.gomethodology.com");
    myHeaders.append("Referer", "https://www.gomethodology.com/");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "same-site");
    myHeaders.append("Sec-GPC", "1");
    myHeaders.append("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("skip-client-timestamp-validation", "true");
    myHeaders.append("Cookie", "_methodology_session=WwJiS1dMtygrQ3CjZpuCQcTsFZhPNexN7jQmzPLZsIiIHePYPUXhKzW%2B7lVfw1P5h30sIORpasl98MZV4VViv3dRPdXJTn8PDYZEoPNcKHB1BqAUMNd8iwM%2FzoIdrmGP2V8zJ2pGa82jU6EVJn8PVGU24K2PcKPtW9u5aaLDW%2FODHqxveBE4KoBkTlyZUZCCLM4ae3I0jQV8cIUhqR9SHifH%2BG5z%2FBSBlSs3oGOv%2B7u75hkEvROXnu68h8peCicvZ7HI9uQ3--LVn6VDOSg6wDSEY9--sdeUodOCK9q2zpR0WvOVEA%3D%3D");

    const graphql = JSON.stringify({
      query: "query ($postal_code: String!) {\n  getZipcodeInfo(zipcode: $postal_code) {\n    status\n  }\n}",
      variables: {"postal_code":"90001"}
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
      redirect: "follow"
    };

    resultDiv.textContent = 'Checking availability...';

    fetch("https://app.gomethodology.com/graphql", requestOptions)
    .then(response => response.json())
    .then(data => {
      if (data.data && data.data.getZipcodeInfo) {
        const status = data.data.getZipcodeInfo.status;
        if (status === "AVAILABLE") {
          resultDiv.textContent = 'Service is available in your area!';
          checkButton.querySelector('a').href = `https://app.gomethodology.com/onramp/sign-up?zipcode=${zipCode}`;
        } else {
          resultDiv.textContent = 'Sorry, service is not available in your area.';
        }
      } else {
        resultDiv.textContent = 'Error checking availability. Please try again.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultDiv.textContent = 'Error checking availability. Please try again.';
    });
  }
});
