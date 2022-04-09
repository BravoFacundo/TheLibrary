void drawText() {
  p1.fill(1); //textAlign(CENTER);
  p1.textSize(50);
  p1.textFont(font);
  p2.textFont(font);
  p2.fill(1); //textAlign(CENTER);
  p2.textSize(50);
  p2.imageMode (CENTER);

  for (int i = 0; i < Renglones; i++) {  //se ordenan los strings del array s en el espacio visual 

    if (i < mitad) {

      p1.text(s[i], 60, ((i+1)*60)+100);
    } else {
      p2.text(s[i], 60, ((i+1-mitad)*60)+100);
    }
  }
}

void guardarString() { //esta función guarda el arreglo string de lo que escribió el usuario
  for (int i = 0; i < Renglones; i++) { //for que suma las strings s (escrito por el usuario) y la igualen a la string guardar (string que es guardada)
    g[0] = g[0] + s[i];
  }
  println(g[0]); 
  saveStrings("textos/texto"+(name++)+".txt", g); //la ruta donde se guarda
  g[0] = ""; //luego de guardarse se reinicia
  FirstTime = false; //se resetea la posibilidad de tocar por primera vez
}

void escribir() { //esta parte se encarga de la escritura, cada if chequea una tecla en específico y define un comportamiento
  if (keyCode == BACKSPACE) { //esto es para borrar
    if (s[Renglon].length() > 0) { //si hay 1 letra o mas
      s[Renglon] = s[Renglon].substring( 0, s[Renglon].length()-1 ); //borra el último carácter
      CantidadTeclas++; //suma la tecla borrada al contador de teclas
    } else if (s[Renglon].length() <= 0 && !Safety) { //si no hay ningun caracter //esto es para volver de renglón
      if (Renglon > 0) {
        Renglon--; //sube un renglón
        s[Renglon] = s[Renglon].substring( 0, s[Renglon].length()-1);
        CantidadTeclas++; //también suma 1 al contador
      }
    }
  } else if (keyCode == ENTER) {  //el enter es para bajar de renglón // safetykey es para prevenir que sea presionado múltiples veces en un mismo tecleo
    if (!SafetyKey) {
      Renglon+=1; //baja un renglón
      SafetyKey = true;
      Safety = true;
    }
  } else if (keyCode == SHIFT) { //shift no hace nada, se ignora si es presionada pero funcionan los caracteres especiales si se aprieta otra tecla en conjunto
    //establecer posibles combos de teclas como el signo de pregunta, etc
  } else if (Renglon != Renglones && !(s[Renglon].length() > CantidadCaracteres)) { 
    s[Renglon] = s[Renglon] + str(key); //aca se escribe la tecla que presionaste
    CantidadTeclas--; //y se le resta al contador que lleva la cuenta de las teclas que debes presionar
  }
  if (s[Renglon].length() > CantidadCaracteres) { //si se supera la cantidad de caracteres por renglón    
    if (Renglon != Renglones-1)Renglon ++;          //bajar un renglón  
    Safety = true;
  }
  if (s[Renglon].length() == 1) { //si ya se escribió al menos 1 carácter
    Safety = false; //las safety son bools que funcionan como un seguro para no presionar cosas en simultáneo que rompan el sistema
  }

  //if (s1.length() > 20){s1 = s1.substring( 0, s1.length()- s1.length() );} borrar todo el renglón al pasarse de tantos caracteres
}
void calibrar() { //estos son los botones para calibrar (del numpad a la derecha) //*para la malla //-para cargar //+para guardar

  switch(key) {
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
