window.MathJax = {
    AuthorInit: function () {
        MathJax.Hub.Config({
            tex2jax: {
                inlineMath: [['$','$'], ['\\(','\\)']],
                skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'] // removed 'code' entry
            }
        });
        
        MathJax.Hub.Queue(function() {
            var all = MathJax.Hub.getAllJax(), i;
            for(i = 0; i < all.length; i += 1) {
                all[i].SourceElement().parentNode.className += ' has-jax';
            }
        });  
    }
};





