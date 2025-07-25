"use client"

import { Lock, LogIn, UserPlus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AcessoNegadoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Acesso Negado</CardTitle>
          <CardDescription className="text-base">
            Você precisa estar logado para acessar esta página.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Faça login com sua conta existente ou crie uma nova conta para continuar.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            {/* Botão de Login */}
            <Link href="/cadastro" passHref>
              <Button className="w-full" size="lg">
                <LogIn className="w-4 h-4 mr-2" />
                Fazer Login
              </Button>
            </Link>

            {/* Botão de Cadastro */}
            <Link href="/cadastro" passHref>
              <Button variant="outline" className="w-full" size="lg">
                <UserPlus className="w-4 h-4 mr-2" />
                Criar Conta
              </Button>
            </Link>
          </div>

          <Separator />

          {/* Botão Voltar */}
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 