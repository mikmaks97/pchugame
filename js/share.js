$(document).ready(function() {
  function openDeviceBrowser(externalLinkToOpen) {
    window.open(externalLinkToOpen, '_system', 'location=no, width=600, height=600');
  }

  function shareTwitter() {
    openDeviceBrowser('https://twitter.com/intent/tweet?url=http://pchugame.com&text=Check%20out%20the%20colorful%2C%20blocky%20world%20of%20Pchu%2C%20the%202-player%2C%20co-op%20browser%20game!&hashtags=pchugame,coop');
  }

  function shareFacebook() {
    openDeviceBrowser('https://www.facebook.com/sharer/sharer.php?u=http://pchugame.com');
  }

  $('#face').on('click', shareFacebook);
  $('#tweet').on('click', shareTwitter);
});
