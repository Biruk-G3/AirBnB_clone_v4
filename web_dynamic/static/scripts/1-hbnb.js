$(function () {
  let amenities = [];
  let selected;
  let unchecked;
  $('input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities.push($(this).attr('data-name'));
    } else {
      unchecked = $(this).attr('data-name');
      amenities = amenities.filter(function (checked) {
        return checked !== unchecked;
      });
    }
    selected = Object.values(amenities).join(', ');
    $('.amenities h4').text(selected);
  });
});
