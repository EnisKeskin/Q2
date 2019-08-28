const { Builder, By, Key, until } = require('selenium-webdriver');

for (let index = 0; index < 5; index++) {
    let driver = new Builder('./chromedriver').forBrowser('chrome').build();
    driver.get('http://localhost:3001/').then(async () => {

        await driver.findElement(By.className('txt-pin')).then(async (pin) => {
            await pin.sendKeys('685811', Key.RETURN).then(async () => {
                await driver.findElement(By.className('btn-pin')).then(async (el) => {
                    el.click()
                });
            });
        });

        await driver.wait(until.elementLocated(By.id('username'))).then(async (el) => {
            await el.sendKeys("Player:" + (index + 1), Key.RETURN).then(async () => {
                await driver.findElement(By.id('btn-username')).then(async (el) => {
                    await el.click();
                })
            });
        })
        await setInterval(() => {
            let randomNum = Math.floor((Math.random() * 5) + 1)
            driver.wait(until.elementLocated(By.className(`answer-${randomNum}`))).then(async (el) => {
                await el.click();
            }).catch(() => {
                
            })
        }, 1000);
    });
}