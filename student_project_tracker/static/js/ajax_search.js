$(document).ready(function() {
    $('#project_title').keyup(function() {
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
                        $('#title_status').text('This title is already taken.').css('color', 'red');
                        $('#submit_btn').prop('disabled', true);
                    } else {
                        $('#title_status').text('Title is available!').css('color', 'green');
                        $('#submit_btn').prop('disabled', false);
                    }
                }
            });
        } else {
            $('#title_status').text('');
            $('#submit_btn').prop('disabled', false);
        }
    });
});
