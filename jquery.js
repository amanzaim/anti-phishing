
$.ajax({
  url: 'https://api.serpstack.com/search',
  data: {
    access_key: 'e703c2c38a2ecc960e15f742f0ad808d',
    query: keyterms
  },
  dataType: 'json',
  success: function(apiResponse) {
    console.log("Total results:", apiResponse.search_information.total_results);
    apiResponse.organic_results.map(function(result, number) {
      console.log(number + 1 + ".", result.title);
    });
  }
});
