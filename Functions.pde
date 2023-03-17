void drawText() {
  p1.fill(1); //textAlign(CENTER);
  p1.textSize(50);
  p1.textFont(font);
  p2.textFont(font);
  p2.fill(1); //textAlign(CENTER);
  p2.textSize(50);
  p2.imageMode (CENTER);

  for (int i = 0; i < lines; i++) {  //se ordenan los strings del array s en el espacio visual

    if (i < linesSplit) {

      p1.text(s[i], 60, ((i+1)*60)+100);
    } else {
      p2.text(s[i], 60, ((i+1-linesSplit)*60)+100);
    }
  }
}

void SaveText() //esta función guarda el arreglo string de lo que escribió el usuario
{
  for (int i = 0; i < lines; i++) //for que suma las strings s (escrito por el usuario) y la igualen a la string guardar (string que es guardada)
  {
    g[0] = g[0] + s[i];
  }
  println(g[0]);
  saveStrings("Texts/UserText"+(nameID++)+".txt", g);
  g[0] = "";
  firstInput = false;
}

void Write() //esta parte se encarga de la escritura, cada if chequea una tecla en específico y define un comportamiento
{
  if (keyCode == BACKSPACE) //esto es para borrar
  {
    if (s[currentLine].length() > 0)
    { //si hay 1 letra o mas
      s[currentLine] = s[currentLine].substring( 0, s[currentLine].length()-1 ); //borra el último carácter
      currentCharactersToWin++; //suma la tecla borrada al contador de teclas
    } else if (s[currentLine].length() <= 0 && !Safety) //si no hay ningun caracter //esto es para volver de renglón
    {
      if (currentLine > 0)
      {
        currentLine--; //sube un renglón
        s[currentLine] = s[currentLine].substring( 0, s[currentLine].length()-1);
        currentCharactersToWin++; //también suma 1 al contador
      }
    }
  } else if (keyCode == ENTER) //el enter es para bajar de renglón // safetykey es para prevenir que sea presionado múltiples veces en un mismo tecleo
  {
    if (!safetyKey)
    {
      currentLine+=1; //baja un renglón
      safetyKey = true;
      Safety = true;
    }
  } else if (keyCode == SHIFT) //shift no hace nada, se ignora si es presionada pero funcionan los caracteres especiales si se aprieta otra tecla en conjunto
  {
    //establecer posibles combos de teclas como el signo de pregunta, etc
  } else if (currentLine != lines && !(s[currentLine].length() > charactersPerLine))
  {
    s[currentLine] = s[currentLine] + str(key); //aca se escribe la tecla que presionaste
    currentCharactersToWin--; //y se le resta al contador que lleva la cuenta de las teclas que debes presionar
  }
  if (s[currentLine].length() > charactersPerLine)
  { //si se supera la cantidad de caracteres por renglón
    if (currentLine != lines-1) currentLine ++;          //bajar un renglón
    Safety = true;
  }
  if (s[currentLine].length() == 1) //si ya se escribió al menos 1 carácter
  {
    Safety = false; //las safety son bools que funcionan como un seguro para no presionar cosas en simultáneo que rompan el sistema
  }

  //if (s1.length() > 20){s1 = s1.substring( 0, s1.length()- s1.length() );} borrar todo el renglón al pasarse de tantos caracteres
}

void CalibrateKS() { //estos son los botones para calibrar (del numpad a la derecha) //*para la malla //-para cargar //+para guardar

  switch(key)
  {
  case '*':  //entrar/salir del modo de calibración
    ks.toggleCalibration();
    break;

  case '-':  //carga el layout guardado
    ks.load();
    break;

  case '+':  //guarda el layout
    ks.save();
    break;
  }
}
