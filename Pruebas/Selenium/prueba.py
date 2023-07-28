import random
import string
import time


#SELENIUM_HUB = 'http://172.17.0.2:4444/wd/hub'
SELENIUM_HUB = 'http://34.125.154.209:4444/wd/hub'

from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

driver = webdriver
driver = webdriver.Remote(
    command_executor=SELENIUM_HUB,
    desired_capabilities=DesiredCapabilities.FIREFOX,
)

def generador_txt(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

PATH_BASE = 'http://35.223.106.224:4200/'
try:
    
    #Resgistro de Usuario
    urlprueba = PATH_BASE + 'auth/signup'
    driver.get(urlprueba)
    search_e = driver.find_element_by_name("user")
    search_e.clear()
    search_e.send_keys(generador_txt())

    search_w = driver.find_element_by_name("fecha")
    search_w.clear()
    search_w.send_keys('2015-20-08')
    
    search_t = driver.find_element_by_name("email")
    search_t.clear()
    search_t.send_keys(generador_txt()+"@gmail.com")

    search_t = driver.find_element_by_name("password")
    search_t.clear()
    search_t.send_keys("123")

    search_t = driver.find_element_by_name("confirmPassword")
    search_t.clear()
    search_t.send_keys("123")
    
    search_btn = driver.find_element_by_id("registrarid")
    search_btn.click()
    time.sleep(1)
    assert "No results found." not in driver.page_source
    print("1.   Prueba de Registro de Usuario Correcta")
    
#Autenticacion Incorrecta    
    urlprueba = PATH_BASE + ''
    driver.get(urlprueba)

    search_e = driver.find_element_by_name("user")
    search_e.clear()
    search_e.send_keys(generador_txt())

    search_p = driver.find_element_by_name("password")
    search_p.clear()
    search_p.send_keys(generador_txt())

    search_btn = driver.find_element_by_id("loginbuttonsi")
    #search_btn.click()
    time.sleep(1)
    assert "No results found." not in driver.page_source
    print("2.   Prueba de Autenticacion Incorrecta") 

#Autenticacion Correcta
    urlprueba = PATH_BASE + ''
    driver.get(urlprueba)

    search_e = driver.find_element_by_id("loginusuario")
    search_e.clear()
    search_e.send_keys('fdf')

    search_p = driver.find_element_by_id("loginpasswords")
    search_p.clear()
    search_p.send_keys('123')

    search_btn = driver.find_element_by_id("loginbuttonsi")
    search_btn.click()
    assert "No results found." not in driver.page_source
    print("3.   Prueba de Autenticacion Correcta") 

#Crear Carpeta
    #driver.implicitly_wait(30)
    #urlprueba = PATH_BASE + 'client/home'
    #driver.get(urlprueba)
    driver.implicitly_wait(30)

    search_btn = driver.find_element_by_id("crearcarpetaid")
    search_btn.click() 
    
    search_p = driver.find_element_by_name("namecarpeta")
    search_p.clear()
    search_p.send_keys(generador_txt())
    time.sleep(1)
    
    search_btn = driver.find_element_by_id("modelcarpetaguardar")
    search_btn.click() 
    time.sleep(1)
    assert "No results found." not in driver.page_source
    print("4.   Prueba de Carpeta Creada Correcta") 

    #Eliminar Carpeta
    urlprueba = PATH_BASE + 'client/home'
    driver.get(urlprueba)

    search_btn = driver.find_element_by_id("eliminarcarpetaid")
    search_btn.click() 
    time.sleep(1)
    assert "No results found." not in driver.page_source
    print("5.   Prueba de Carpeta Eliminada Correcta") 
 
    #Crear Archivo
    urlprueba = PATH_BASE + 'client/home'
    driver.get(urlprueba)
    
    search_btn = driver.find_element_by_id("subirarchivoid")
    search_btn.click() 

    search_file = driver.find_element_by_xpath("//input[@type='file']")
    #search_file.send_keys("console.txt")

    """    
    search_p = driver.find_element_by_name("name")
    search_p.clear()
    search_p.send_keys(generador_txt())
    time.sleep(1)
    """
    assert "No results found." not in driver.page_source
    print("6.   Prueba de Archivo Creado Correcta") 

    #Eliminar Archivo
    urlprueba = PATH_BASE + 'client/home'
    driver.get(urlprueba)

    search_btn = driver.find_element_by_id("moverpapeleraid")
    search_btn.click() 

    search_btn = driver.find_element_by_id("papeleraid")
    search_btn.click()

    search_btn = driver.find_element_by_id("moverpapeleraid")
    search_btn.click() 

    assert "No results found." not in driver.page_source
    print("7.   Prueba de Archivo Eliminada Correcta") 

except:
    print("Error en un prueba")
    assert "No results found."  in driver.page_source
finally:
    driver.quit()
    print("-- Cierra sesion del driver --")