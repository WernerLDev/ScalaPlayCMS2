

(function($) {

    
    $(document).ready(function(){
        
        var youtubevideos = document.getElementsByClassName("editable-youtube");
        [].forEach.call(youtubevideos, function(item){
            var iframe = item.getElementsByTagName("iframe")[0];
            var input = item.getElementsByTagName("input")[0];
            console.log(input);
            $(input).on('input', function(e){
                console.log("triggered");
                console.log(e.target.value);
                iframe.src = "https://www.youtube.com/embed/" + e.target.value;
            });
        });

    });
    

})(jQuery);