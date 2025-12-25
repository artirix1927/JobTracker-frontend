import { useEffect, useState } from "react";
import "../styles/clock.css"; // keep your styles here

type Theme = "light" | "dark";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [theme] = useState<Theme>("light");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Digit to segment class names
  const digitToName = ["zero","one","two","three","four","five","six","seven","eight","nine"];

  // Format time
  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const pad = (n: number) => n.toString().padStart(2, "0");

  const timeString = `${pad(hours)}${pad(minutes)}${pad(seconds)}`;

  const weekdays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const dow = time.getDay(); // 0 = Sunday

  return (
    <div id="clock" className={theme}>
      <div className="display">
        <div className="weekdays">
          {weekdays.map((day, idx) => (
            <span key={idx} className={idx === dow ? "active" : ""}>{day}</span>
          ))}
        </div>

        <div className="ampm">{ampm}</div>
        <div className="alarm"></div>

        <div className="digits">
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={digitToName[parseInt(timeString[i])]}>
                {[...Array(7)].map((_, j) => <span key={j} className={`d${j + 1}`}></span>)}
                </div>
            )).flatMap((digitDiv, idx) => {
                // Insert colon after hour and minute digits
                if (idx === 1 || idx === 3) {
                return [digitDiv, <div key={`colon-${idx}`} className="dots"></div>];
                }
                return [digitDiv];
            })}
        </div>
      </div>

      
    </div>
  );
}
