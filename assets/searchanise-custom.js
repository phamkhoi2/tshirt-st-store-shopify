document.addEventListener('Searchanise.Loaded', function() {
  (function($) {
    $(document).on('Searchanise.ResultsUpdated', function(event, container) {

      if (Searchanise.GetWidgets() && Searchanise.GetWidgets().searchResults) {
        var prevData = Searchanise.GetWidgets().searchResults.getPrevData();
       
        if (prevData && prevData.params && prevData.params.q) {
          $('.section__title-text').eq(0).text(prevData.params.q + ' の検索結果');
        }
      }
    });
  })(window.Searchanise.$);
});


