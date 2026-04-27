$(document).ready(function() {
    $('#id_title').keyup(function() {
        var query = $(this).val();
        if (query.length > 2) {
            $.ajax({
                url: '/api/check-title/',
                data: {
                    'q': query
                },
                dataType: 'json',
                success: function(data) {
                    if (data.is_taken) {
                        $('#title_error').text('This project title is already taken.').css('color', 'red');
                    } else {
                        $('#title_error').text('Title is available.').css('color', 'green');
                    }
                }
            });
        } else {
            $('#title_error').text('');
        }
    });
});
