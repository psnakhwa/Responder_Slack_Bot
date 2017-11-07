package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.io.IOException;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.ChromeDriverManager;


public class SeleniumTest
{
	private static WebDriver driver;
	
	@BeforeClass
	public static void setUp() throws Exception
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
		driver.get("https://projectteam510.slack.com/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Type in our test user login info.
		email.sendKeys("trazibot@gmail.com");
		pw.sendKeys("1234gopack");

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();
		
		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));	
		
		//Switch to #bots channel and wait for it to load.
		driver.get("https://projectteam510.slack.com/messages/selenium_test");
		wait.until(ExpectedConditions.titleContains("selenium_test"));
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}

	@Test
	public void Usecase1_happy_path()
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);
		Actions actions = new Actions(driver);
		actions.moveToElement(driver.findElement(By.id("msg_input")));
		actions.click();
		actions.sendKeys("@trazi_aayush find assignees for issue 5");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Whom do you want to assign this issue?')]")));
		
		actions.sendKeys("psnakhwa");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Do you want to assign issue to')]")));
		
		actions.sendKeys("yes");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Issue 5 assigned to psnakhwa')]")));			
	}

	@Test
	public void Usecase1_alternative_path()
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);
		Actions actions = new Actions(driver);
		actions.moveToElement(driver.findElement(By.id("msg_input")));
		actions.click();
		actions.sendKeys("@trazi_aayush find assignees for issue 5");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Whom do you want to assign this issue?')]")));
		
		actions.sendKeys("abcd");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'User not from given recommendations, enter valid id.')]")));
		
		actions.sendKeys("psnakhwa");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Do you want to assign issue to')]")));
		
		actions.sendKeys("no");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Ok! Ping me if you need anything!')]")));
	}
	
	@Test
	public void Usecase2_happy_path()
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);
		Actions actions = new Actions(driver);
		actions.moveToElement(driver.findElement(By.id("msg_input")));
		actions.click();
		actions.sendKeys("@trazi_aayush find contributors for file abc.java");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()-3]/div[2]/span[@class='message_body' and contains(text(),'The major contributors are:')]")));
	}
	
	@Test
	public void Usecase3_happy_path()
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);
		Actions actions = new Actions(driver);
		actions.moveToElement(driver.findElement(By.id("msg_input")));
		actions.click();
		actions.sendKeys("@trazi_aayush find reviewers for issue 5");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Whom do you want to select as a reviewer?')]")));
		
		actions.sendKeys("psnakhwa");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Do you want to assign psnakhwa as a reviewer for issue #?5 Please confirm')]")));
		
		actions.sendKeys("yes");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Reviewer psnakhwa assigned to issue #5')]")));
		
	}
	
	@Test
	public void Usecase3_alternative_path()
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);
		Actions actions = new Actions(driver);
		actions.moveToElement(driver.findElement(By.id("msg_input")));
		actions.click();
		actions.sendKeys("@trazi_aayush find reviewers for issue 5");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Whom do you want to select as a reviewer?')]")));
		
		actions.sendKeys("asagarwa");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'User asagarwa not from given recommendations, enter valid id.')]")));
		
		actions.sendKeys("psnakhwa");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Do you want to assign psnakhwa as a reviewer for issue #?5 Please confirm')]")));
		
		actions.sendKeys("no");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'Ok! Ping me if you need anything!')]")));
	}

}
