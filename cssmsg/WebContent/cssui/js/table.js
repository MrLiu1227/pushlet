/*
 * $newTable v1.0
 */
function submitForm(form,currentPage){
	 form.find('.page-current').val(currentPage);
    form.find('.page-size').val(form.find('.page-num').val());
    $navTab.submitForm(form[0]);
    //form.submit();
    return false;

}
;(function($){
 	$newTable = {
 		initFlag:false,
 		getCurrentForm:function(el){
 			return $(el).parents('.table-form');
 		},
 		getCheckbox:function(el){
 			return $css.checkedVal('ids',$newTable.getCurrentForm(el));
 		},
 		event: function(){
 			if($newTable.initFlag==true) return;
 			else
 				$newTable.initFlag =true;
 			$('body').on('click','.table-pagination .page-prev',function(){
	        var $form=$(this).parents('.table-form'),
	            prevPage=parseInt($form.find('.page-current').val())-1;
	        if(prevPage==0)
	        		prevPage=1; 
	        submitForm($form,prevPage);   
	    })
	    $('body').on('click','.table-pagination .page-next',function(){
	        var $form=$(this).parents('.table-form'),
	            pageCount=parseInt($form.find('.page-count').val()),
	            nextPage=parseInt($form.find('.page-current').val())+1;
	        if(nextPage>pageCount)
	            nextPage=pageCount;
	        submitForm($form,nextPage);   
	    })
	    $('body').on('click','.table-pagination .page-first',function(){
	        $form=$(this).parents('.table-form');
	        submitForm($form,1);   
	    })
	    $('body').on('click','.table-pagination .page-last',function(){
	        $form=$(this).parents('.table-form');
	        submitForm($form,$form.find('.page-count').val());   
	    })
	    $('body').on('click','.table-pagination .page-go',function(){
	        var $form=$(this).parents('.table-form'),
	            pageNum=parseInt($form.find('.page-jump').val());
	            pageCount=parseInt($form.find('.page-count').val());
	        if(pageNum>pageCount)
	            pageNum=pageCount;  
	        if(pageNum==0)
	            pageNum=1;      
	        $form=$(this).parents('.table-form');
	        submitForm($form,pageNum);   
	    })
	    $('body').on('keydown','.table-pagination .page-jump',function(event){
	    	var ENTER = 13;
	    	if(event.keyCode==ENTER){
	    		$form=$(this).parents('.table-form');
	    		$form.find('.page-current').val($form.find('.page-jump').val());
	        $form.submit();
	    	}
	    })
	    $('body').on('keydown','.table-pagination .page-num',function(){
	    	var ENTER = 13;
	    	if(event.keyCode==ENTER){
	    		$form=$(this).parents('.table-form');
	    		$form.find('.page-size').val($form.find('.page-num').val());
	        $form.submit();
	    	}
	    })
	    $('body').on('click','th[order-field]',function(){
	        var $this=$(this),
	            $form=$this.parents('.table-form'),
	            orderFlag=$form.find('.order-flag').val();
	        $form.find('.order-flag').val(1-orderFlag);
	        $form.find('.order-string').val($this.attr('order-field'));
	        $form.submit();
	    })
	    $('body').on('click','.cleck-all',function(){
	        var $this=$(this),
	            $form=$this.parents('.table-form');
	            group=$this.attr('group');
	        $form.find('input[name="'+group+'"]').prop('checked',$this.prop("checked"));
	    })
 		}
  };
})(jQuery)