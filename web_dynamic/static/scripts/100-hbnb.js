const filterTemplate = '' +
  '<article>' +
  '<div class="title_box">' +
  '<h2>{{ name }}</h2>' +
  '<div class="price_by_night">${{ price_by_night }}</div>' +
  '</div>' +
  '<div class="information">' +
  '<div class="max_guest">{{ max_guest }}</div>' +
  '<div class="number_rooms">{{ number_rooms }} </div>' +
  '<div class="number_bathrooms">{{ number_bathrooms }}</div>' +
  '</div>' +
  '<div class="description">' +
  '{{{ description }}} ' +
  '</div>' +
  '</article>';

function addFilter (place) {
  return (Mustache.render(filterTemplate, place));
}

$(function () {
  let amenitiesName = [];
  let amenitiesId = [];
  let statesName = [];
  let statesId = [];
  let citiesName = [];
  let citiesId = [];
  let selected;
  let uncheckedName;
  let uncheckedId;
  $('input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      if ($(this).attr('data-type') === 'states') {
        statesName.push($(this).attr('data-name'));
        statesId.push($(this).attr('data-id'));
      } else if ($(this).attr('data-type') === 'cities') {
        citiesName.push($(this).attr('data-name'));
        citiesId.push($(this).attr('data-id'));
      } else {
        amenitiesName.push($(this).attr('data-name'));
        amenitiesId.push($(this).attr('data-id'));
      }
    } else {
      uncheckedName = $(this).attr('data-name');
      uncheckedId = $(this).attr('data-id');
      if ($(this).attr('data-type') === 'states') {
        statesName = statesName.filter(function (checked) {
          return checked !== uncheckedName;
        });
        statesId = statesId.filter(function (checked) {
          return checked !== uncheckedId;
        });
      } else if ($(this).attr('data-type') === 'cities') {
        citiesName = citiesName.filter(function (checked) {
          return checked !== uncheckedName;
        });
        citiesId = citiesId.filter(function (checked) {
          return checked !== uncheckedId;
        });
      } else {
        amenitiesName = amenitiesName.filter(function (checked) {
          return checked !== uncheckedName;
        });
        amenitiesId = amenitiesId.filter(function (checked) {
          return checked !== uncheckedId;
        });
      }
    }
    selected = Object.values(amenitiesName).join(', ');
    $('.amenities h4').text(selected);
    $('.locations h4').text(Object.values(statesName.concat(citiesName)).join(', '));
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (data) {
      for (const i in data) {
        $('section.places').append(addFilter(data[i]));
      }
    }
  });
  $('button').click(function () {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: amenitiesId, states: statesId, cities: citiesId }),
      success: function (data) {
        $('section.places').empty();
        for (const i in data) {
          $('section.places').append(addFilter(data[i]));
        }
      }
    });
  });
});
