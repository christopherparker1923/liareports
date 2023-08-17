// import { Text, useMantineTheme } from "@mantine/core";
// import { useEffect, useState } from "react";

// const Clock = ({ className }: { className: string }) => {
//   const [currentTime, setCurrentTime] = useState("");
//   const theme = useMantineTheme();

//   useEffect(() => {
//     const fetchTime = async () => {
//       try {
//         const response = await fetch("http://worldtimeapi.org/api/ip");
//         const data = await response.json();
//         const { datetime } = data;
//         setCurrentTime(datetime);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchTime();

//     // Fetch time every second
//     const interval = setInterval(fetchTime, 1000);

//     // Cleanup the interval on component unmount
//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return <Text className={className}>{`${currentTime}`}</Text>;
// };

// export default Clock;

export {};
