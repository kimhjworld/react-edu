function printLater(number) {
    setTimeout(
        function() {
            console.log(number);
        },
        1000
    );
}

printLater(1);
