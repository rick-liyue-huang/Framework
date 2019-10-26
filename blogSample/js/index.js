
// using jQuery to handle event
// using ajax to communicate with 'weibo.php' file

// listen the input value change
$('body').delegate('.comment', 'propertychange input', function() {
  // console.log($(this).val());
  // confirm it has value
  if($(this).val().length > 0) {
    // let 'send' input enable
    $('.send').prop('disabled', false); 
  } else {
    // let 'send' input disable
    $('.send').prop('disabled', true);
  }
})

$('.send').click(function() {
  // alert('send');
  // get the content of textarea
  var $text = $('.comment').val();

  // start to use ajax to communicate with server
  $.ajax({
    type: 'get',
    url: 'weibo.php',
    data: 'act=add&content='+$text,
    success: function(msg) {
      // match the return data with the server setting content
      // {error: 0, id: 0, time: 1572092453, acc: 0, ref: 0}
      // {error: 0, id: 新添加内容的ID, time: 添加时间, acc: 点赞数, ref: 点踩数}
      console.log(msg);
    },
    error: function(xhr) {
      console.log(xhr.status);
    }
  })


  // create node
  var $blog = createElement($text);
  $('.message-list').prepend($blog);
});

// listen the three a links by delegate
$('body').delegate('.info-up', 'click', function() {
  $(this).text(parseInt($(this).text()) + 1);
});

$('body').delegate('.info-down', 'click', function() {
  $(this).text(parseInt($(this).text()) + 1);
});

$('body').delegate('.info-del', 'click', function() {
  $(this).parents('.info').remove();
});

// creat blog function
function createElement(text) {
  return $(`
  <div class="info">
    <p class="info-text">
      ${text}
    </p>
    <p class="info-operation">
      <span class="info-time">
        ${formatDate()}
      </span>
      <span class="info-handle">
        <a class="info-up" href="javascript:;">0</a>
        <a class="info-down" href="javascript:;">0</a>
        <a class="info-del" href="javascript:;">delete</a>
      </span>
    </p>
  </div>
  `);
}

// create blog send time function
function formatDate() {
  var date = new Date();
  return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1) }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${date.getHours() < 10 ? '0'+date.getHours() : date.getHours() }:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() }:${date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds()}`;
}