import { Screen } from "@/components/ui/screen"
import { useState } from "react"
import { View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import type { AuthMode } from "../hooks/use-sign-in"
import { SignInForm } from "./sign-in-form"
import { SignInHero } from "./sign-in-hero"
import { SignInLegalFooter } from "./sign-in-legal-footer"
import { SignInOAuthRow } from "./sign-in-oauth-row"
import { SignInTabs } from "./sign-in-tabs"

export function SignInScreen() {
  const [mode, setMode] = useState<AuthMode>("in")

  return (
    <Screen bg="cream" padded={false}>
      <KeyboardAwareScrollView
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <SignInHero mode={mode} />

        <View className="mt-s-5">
          <SignInTabs active={mode} onChange={setMode} />
        </View>

        <View className="mt-s-5">
          <SignInOAuthRow />
        </View>

        <SignInForm mode={mode} />

        <View className="flex-1" />
        <SignInLegalFooter />
      </KeyboardAwareScrollView>
    </Screen>
  )
}
