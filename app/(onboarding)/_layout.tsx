import { Link, Stack } from "expo-router";
import { Text } from "react-native";

export default function OnboardingLayout() {
    return (
        <Stack>
            <Stack.Screen name="index"
            
            options={{
                headerRight: () => (
                    <Link href='/bookgoal' asChild>
                            <Text className="text-white ">Skip</Text>
                    </Link>
                ),
                headerShown: true,
                contentStyle: {
                    backgroundColor: '#000000' 
                },
                headerStyle: {
                    backgroundColor: '#000000'
                },
                headerTitle: 'Onboarding',
                headerTitleStyle: {
                    color: '#ffffff'
                }
            }}

        
            />
            <Stack.Screen name="bookgoal"
            options={{
                headerShown: true,
                contentStyle: {
                    backgroundColor: '#000000'
                },
                headerStyle: {
                    backgroundColor: '#000000'
                },
                headerTitle: 'Book Goal',
                headerTitleStyle: {
                    color: '#ffffff'
                }
            }}/>
            <Stack.Screen name="notifications"
            options={{
                headerShown: true,
                headerTitle: 'Notifications',
                headerTitleStyle: {
                    color: '#ffffff'
                },
                contentStyle: {
                    backgroundColor: '#000000'
                },
                headerStyle: {
                    backgroundColor: '#000000'
                }
            }}/>
            <Stack.Screen name="readingGoal"
            options={{
                headerShown: true,
                headerTitle: 'Reading Goal',
                headerTitleStyle: {
                    color: '#ffffff'
                },
                contentStyle: {
                    backgroundColor: '#000000'
                },
                headerStyle: {
                    backgroundColor: '#000000'
                }
            }}/>
        </Stack>
    )
}