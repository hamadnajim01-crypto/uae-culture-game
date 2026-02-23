/* API Shim — replaces server API calls with client-side data for static hosting */
(function(){
  var _data = null;
  var _loading = null;

  function loadData(){
    if(_data) return Promise.resolve(_data);
    if(_loading) return _loading;
    _loading = fetch('/uae-culture-game/data/uae-content.json').then(function(r){return r.json()}).then(function(d){_data=d;return d});
    return _loading;
  }

  function shuffle(arr){
    var a=arr.slice();
    for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}
    return a;
  }

  function jsonResponse(data){
    return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});
  }

  var _origFetch = window.fetch;
  window.fetch = function(url, opts){
    if(typeof url !== 'string' || url.indexOf('/api/') !== 0) return _origFetch.apply(this, arguments);

    return loadData().then(function(d){
      if(url==='/api/quiz-questions') return jsonResponse(shuffle(d.quizQuestions).slice(0,10));
      if(url==='/api/landmarks') return jsonResponse(d.landmarks);
      if(url==='/api/arabic-words') return jsonResponse(d.arabicWords);
      if(url==='/api/foods') return jsonResponse(d.foods);
      if(url==='/api/fill-blank') return jsonResponse(shuffle(d.fillInTheBlank).slice(0,10));
      if(url==='/api/true-false') return jsonResponse(shuffle(d.trueFalse).slice(0,15));
      if(url==='/api/listening') return jsonResponse(shuffle(d.listeningChallenge).slice(0,10));
      if(url==='/api/scramble') return jsonResponse(shuffle(d.wordScramble).slice(0,10));
      if(url==='/api/timeline') return jsonResponse(shuffle(d.timeline).slice(0,8));
      if(url.indexOf('/api/section-quiz/')===0){
        var sec=url.replace('/api/section-quiz/','');
        var q=d.sectionQuizzes&&d.sectionQuizzes[sec];
        if(!q) return jsonResponse({error:'Section not found'});
        return jsonResponse(shuffle(q));
      }
      if(url==='/api/score'&&opts&&opts.method==='POST'){
        return jsonResponse({stars:3,totalStars:0});
      }
      if(url.indexOf('/api/scores/')===0){
        return jsonResponse({totalStars:0,games:{}});
      }
      return _origFetch.apply(this,[url,opts]);
    });
  };
})();
