var cluster = require('cluster');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

if (cluster.isMaster) {
    for (var i = 0; i < 4; i++) {
        cluster.fork();
    }
} else {
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:5555/webdriver')
        .build();

    driver.get('http://www.google.com/ncr');
    driver.findElement(By.name('q')).sendKeys('webdriver');
    driver.findElement(By.name('btnG')).click();
    driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    driver.quit();
}
